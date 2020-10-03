<?php
namespace SVB\CBS\ShippingWorldBundle\Model;
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 21.09.15
 * Time: 17:06
 */
interface ShipperInterface extends ActorInterface
{

    /**
     * @return ShipInterface[]
     */
    public function getShips();

}