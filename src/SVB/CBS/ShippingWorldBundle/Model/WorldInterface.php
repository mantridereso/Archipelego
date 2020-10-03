<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 25.09.15
 * Time: 16:29
 */

namespace SVB\CBS\ShippingWorldBundle\Model;


interface WorldInterface
{

    /**
     * @return string
     */
    public function getName();

    /**
     * @return IslandInterface[]
     */
    public function getIslands();

    /**
     * @return ShipInterface[]
     */
    public function getShips();

    /**
     * @return int
     */
    public function getExtent();

    /**
     * @return int
     */
    public function getGestalt();

    /**
     * @return array
     */
    public function export();

}