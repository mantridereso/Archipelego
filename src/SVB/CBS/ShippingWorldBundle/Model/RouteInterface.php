<?php
namespace SVB\CBS\ShippingWorldBundle\Model;
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 21.09.15
 * Time: 17:05
 */
interface RouteInterface
{

    /**
     * @return VillageInterface
     */
    public function getOrigin();

    /**
     * @return VillageInterface
     */
    public function getDestination();


}